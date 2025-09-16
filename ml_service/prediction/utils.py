import pandas as pd
from collections import defaultdict
import numpy as np
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
import os
import joblib

def structure_data(json_data):
    struct = defaultdict(dict)

    for block in json_data.get("data", []):
        code = block["code"]
        
        for item in block["values"]:
            date = item["timestamp"]
            value = item["value"]

            if date is None or value is None:
                continue
            
            struct[date][code] = value
    
    df = pd.DataFrame.from_dict(struct, orient='index')
    df.index = pd.to_datetime(df.index)
    df.sort_index(inplace=True)
    return df

def structure_data_single_row(json_data):
    """
    Convierte un JSON de predicción de una sola fila en DataFrame.
    Espera formato:
    {
        "wspd": 14.3,
        "pres": 1012,
        "prcp": 3.2,
        "tmax": 32.5,
        "tmin": 21.4,
        "tavg": 27.0
    }
    """
    print("🔍 Django recibió json_data:", json_data)
    print("🔍 Tipo de json_data:", type(json_data))
    
    if isinstance(json_data, list) and len(json_data) == 1:
        json_data = json_data[0]
    
    print("🔍 Datos después del procesamiento:", json_data)
    print("🔍 Keys disponibles:", list(json_data.keys()) if isinstance(json_data, dict) else "No es dict")
    
    df = pd.DataFrame([json_data])
    print("🔍 DataFrame creado:")
    print("  - Shape:", df.shape)
    print("  - Columns:", list(df.columns))
    print("  - Data:", df.to_dict())
    
    return df

def train_model(df, targets=None):
    """
    Entrena un HistGradientBoostingRegressor para cada target en el DataFrame.
    Sustituye el RandomForestRegressor por HGB ya que ofrece mejor desempeño en tus datos.
    """
    if targets is None:
        raise ValueError("Debes especificar al menos una variable objetivo en 'targets'.")

    results = {}
    models = {}

    # Hiperparámetros a optimizar
    param_grid = {
        'regressor__max_iter': [100, 200, 500],   # número de árboles
        'regressor__learning_rate': [0.01, 0.05, 0.1],
        'regressor__max_depth': [None, 5, 10],   # profundidad de los árboles
        'regressor__min_samples_leaf': [10, 20, 50]
    }

    for target in targets:
        df_model = df.copy()
        n_jobs = max(1, os.cpu_count() // 2)

        # Variable objetivo: valor del día siguiente
        next_day_col = f"{target}_next_day"
        df_model[next_day_col] = df_model[target].shift(-1)
        df_model = df_model.dropna(subset=[next_day_col])

        # Features = todas excepto la columna objetivo
        features = [col for col in df_model.columns if col not in [next_day_col]]
        X = df_model[features]
        y = df_model[next_day_col]

        # División train/test (sin shuffle, para respetar la serie temporal)
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42, shuffle=False
        )

        # Pipeline: imputación (HGB ya maneja NaN, pero lo dejamos por seguridad)
        pipeline = Pipeline([
            ('imputer', SimpleImputer(strategy='mean')),
            ('regressor', HistGradientBoostingRegressor(random_state=42))
        ])

        # GridSearchCV
        grid_search = GridSearchCV(
            estimator=pipeline,
            param_grid=param_grid,
            cv=3,
            scoring='neg_mean_squared_error',
            n_jobs=n_jobs,
            error_score='raise'
        )
        grid_search.fit(X_train, y_train)

        best_model = grid_search.best_estimator_
        y_pred = best_model.predict(X_test)

        # --- Métricas ---
        mse = mean_squared_error(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_test, y_pred)

        results[target] = {"mse": mse, "mae": mae, "rmse": rmse, "r2": r2}
        models[target] = best_model

    return models, results

def load_latest_model():
    from prediction.models import TrainedModel
    last_model = TrainedModel.objects.latest("date_trained")
    model_path = last_model.path_to_file
    model = joblib.load(model_path)
    return last_model, model


def make_prediction(model, df):
    print("🔍 Modelo cargado, features esperadas:", list(model.feature_names_in_))
    print("🔍 DataFrame recibido:")
    print("  - Shape:", df.shape)
    print("  - Columns:", list(df.columns))
    print("  - Data:", df.to_dict())
    
    used_features = model.feature_names_in_
    
    # Validar columnas
    missing = [f for f in used_features if f not in df.columns]
    if missing:
        available_cols = list(df.columns)
        print(f"❌ Features faltantes: {missing}")
        print(f"❌ Features disponibles: {available_cols}")
        raise ValueError(f"Faltan columnas en el DataFrame: {missing}")

    X = df[used_features]
    pred = model.predict(X)[0]
    return float(pred), list(used_features)