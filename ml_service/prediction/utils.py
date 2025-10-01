import pandas as pd
from collections import defaultdict
import numpy as np
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import LinearRegression
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

def train_model(df, targets=None, min_samples=10):
    """
    Entrena un modelo por cada target en 'targets'.
    - Si hay muy pocos datos, usa DummyRegressor como fallback (último valor).
    - Si hay pocos pero no tan extremos, usa LinearRegression.
    - Si hay suficientes, usa HistGradientBoostingRegressor.
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

        # Crear columna para predecir (día siguiente)
        next_day_col = f"{target}_next_day"
        df_model[next_day_col] = df_model[target].shift(-1)
        df_model = df_model.dropna(subset=[next_day_col])

        features = [col for col in df_model.columns if col != next_day_col]
        X = df_model[features]
        y = df_model[next_day_col]

        # ⚠️ Caso extremo: menos de 3 datos
        if len(df_model) < 3:
            print(f"⚠️ Muy pocos datos para '{target}' ({len(df_model)} filas). Usando DummyRegressor (último valor).")

            pipeline = Pipeline([
                ("imputer", SimpleImputer(strategy="mean")),
                ("regressor", DummyRegressor(strategy="constant", constant=y.iloc[-1]))
            ])
            pipeline.fit(X, y)

            # Métricas triviales (entrena con todo)
            y_pred = pipeline.predict(X)
            mse = mean_squared_error(y, y_pred)
            mae = mean_absolute_error(y, y_pred)
            rmse = np.sqrt(mse)
            r2 = r2_score(y, y_pred)

        # 🔹 Caso intermedio: pocos datos pero >= 3
        elif len(df_model) < min_samples:
            print(f"⚠️ Pocos datos para '{target}' ({len(df_model)} filas). Usando LinearRegression como fallback.")

            pipeline = Pipeline([
                ("imputer", SimpleImputer(strategy="mean")),
                ("regressor", LinearRegression())
            ])
            pipeline.fit(X, y)

            y_pred = pipeline.predict(X)
            mse = mean_squared_error(y, y_pred)
            mae = mean_absolute_error(y, y_pred)
            rmse = np.sqrt(mse)
            r2 = r2_score(y, y_pred)

        # ✅ Caso normal: suficientes datos
        else:
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, shuffle=False
            )

            pipeline = Pipeline([
                ("imputer", SimpleImputer(strategy="mean")),
                ("regressor", HistGradientBoostingRegressor(random_state=42))
            ])
            pipeline.fit(X_train, y_train)

            y_pred = pipeline.predict(X_test)
            mse = mean_squared_error(y_test, y_pred)
            mae = mean_absolute_error(y_test, y_pred)
            rmse = np.sqrt(mse)
            r2 = r2_score(y_test, y_pred)

        # Guardar resultados
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
