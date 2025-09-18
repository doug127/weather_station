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

    for item in json_data:
        timestamp = item["timestamp"]
        for val in item["values"]:
            code = val["code"]
            value = val["value"]
            struct[timestamp][code] = value

    df = pd.DataFrame.from_dict(struct, orient="index")
    df.index = pd.to_datetime(df.index)
    df.sort_index(inplace=True)
    return df


def train_model(df, targets=None):
    """
    Entrena un modelo por cada target en 'targets'.
    - df: DataFrame con todas las features disponibles.
    - targets: lista de columnas objetivo.

    Este algoritmo es flexible: si faltan columnas, las rellena con NaN y se entrena con las disponibles.
    """
    if not targets:
        raise ValueError("Debes especificar al menos una variable objetivo en 'targets'.")

    results = {}
    models = {}

    for target in targets:
        df_model = df.copy()

        if target not in df_model.columns:
            print(f"⚠️ Target '{target}' no existe en el DataFrame, se omite.")
            continue

        # Target = valor del día siguiente
        next_day_col = f"{target}_next_day"
        df_model[next_day_col] = df_model[target].shift(-1)
        df_model = df_model.dropna(subset=[next_day_col])

        # Features = todas menos target_next_day
        features = [col for col in df_model.columns if col != next_day_col]

        # Rellenar columnas faltantes con NaN para permitir imputación
        for col in features:
            if col not in df_model.columns:
                df_model[col] = np.nan

        X = df_model[features]
        y = df_model[next_day_col]

        # División temporal (sin shuffle)
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, shuffle=False
        )

        # Pipeline con imputación + modelo
        pipeline = Pipeline([
            ("imputer", SimpleImputer(strategy="mean")),  # rellenará NaN automáticamente
            ("regressor", HistGradientBoostingRegressor(random_state=42))
        ])

        # Entrenar modelo
        pipeline.fit(X_train, y_train)
        y_pred = pipeline.predict(X_test)

        # Métricas
        mse = mean_squared_error(y_test, y_pred)
        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_test, y_pred)

        results[target] = {"mse": mse, "mae": mae, "rmse": rmse, "r2": r2}
        models[target] = pipeline

        print(f"✅ Modelo entrenado para target '{target}' con {X.shape[1]} features")

    if not models:
        raise ValueError("No se entrenó ningún modelo, revisa que haya columnas y targets disponibles.")

    return models, results



def load_latest_model():
    from prediction.models import TrainedModel
    last_model = TrainedModel.objects.latest("date_trained")
    model_path = last_model.path_to_file
    models_dict = joblib.load(model_path)  # contiene varios modelos
    return last_model, models_dict


def make_predictions(models_dict, df):
    """
    Genera predicciones para cada target en models_dict de forma flexible.
    Rellena automáticamente columnas faltantes con NaN.
    """
    predictions = {}

    for target, model in models_dict.items():
        # Columnas que el modelo espera
        used_features = list(model.feature_names_in_)

        # Crear copia del DataFrame de entrada
        df_model = df.copy()

        # Agregar columnas faltantes con NaN
        for col in used_features:
            if col not in df_model.columns:
                df_model[col] = np.nan

        # Reordenar columnas según el orden que espera el modelo
        df_model = df_model[used_features]

        try:
            pred = model.predict(df_model)[0]
            predictions[target] = float(pred)
        except Exception as e:
            print(f"❌ No se pudo predecir {target}: {e}")
            predictions[target] = None  # fallback si algo falla

    return predictions
