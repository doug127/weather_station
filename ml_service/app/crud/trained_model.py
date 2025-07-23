from fastapi import APIRouter, HTTPException, Request
from sqlalchemy.orm import Session
from app.db.base import get_db
from app.models.trained_model import TrainedModel
from ..schemas import TrainedModelCreate
from ..utils import save_model_pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
import pandas as pd
import numpy as np
import datetime
import pickle
import os

router = APIRouter()

@router.post("/train_model/")
def train_model(request: Request, db: Session = next(get_db())):
    try:
        data = request.json()

        sensor = data["sensor"]
        raw_values = data["values"]

        # Crear el DataFrame a partir de los valores
        df = pd.DataFrame(raw_values)
        df["datetime"] = pd.to_datetime(df["date"] + " " + df["hour"])
        df = df.sort_values("datetime").set_index("datetime")

        # Simulación de columnas que tenías en el modelo anterior
        # Puedes cambiar esto para adaptarlo a tus sensores reales
        df["prcp_unico"] = df["value"]  # Suponemos que 'value' es precipitación
        df["tavg_unico"] = np.random.uniform(20, 30, size=len(df))
        df["tmin_unico"] = df["tavg_unico"] - 2
        df["tmax_unico"] = df["tavg_unico"] + 2
        df["wdir_unico"] = np.random.uniform(0, 360, size=len(df))
        df["wspd_unico"] = np.random.uniform(0, 10, size=len(df))
        df["pres_unico"] = np.random.uniform(1000, 1020, size=len(df))

        # Etiquetado: llueve y lloverá al día siguiente
        df["llueve"] = (df["prcp_unico"] > 0).astype(int)
        df["llovera_dia_siguiente"] = df["llueve"].shift(-1)
        df.dropna(subset=["llovera_dia_siguiente"], inplace=True)

        X = df[["tavg_unico", "tmin_unico", "tmax_unico", "wdir_unico", "wspd_unico", "pres_unico"]]
        y = df["llovera_dia_siguiente"].astype(int)

        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Entrenamiento con búsqueda de hiperparámetros
        rf = RandomForestClassifier(random_state=42)
        param_grid = {
            'n_estimators': [50, 100],
            'max_depth': [None, 10],
            'min_samples_split': [2, 5],
            'min_samples_leaf': [1, 2],
            'max_features': ['sqrt']
        }

        grid = GridSearchCV(estimator=rf, param_grid=param_grid, cv=3, scoring='accuracy', n_jobs=-1)
        grid.fit(X_train, y_train)

        model = grid.best_estimator_
        y_pred = model.predict(X_test)
        y_probs = model.predict_proba(X_test)[:, 1]

        # Métricas
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred)
        recall = recall_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred)
        roc_auc = roc_auc_score(y_test, y_probs)

        # Guardar el modelo
        filename = f"rf_model_{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}.pkl"
        filepath = os.path.join("ml_service", "models", filename)
        with open(filepath, "wb") as f:
            pickle.dump(model, f)

        # Almacenar en base de datos
        new_model = TrainedModel(
            sensor=sensor,
            model_path=filepath,
            accuracy=accuracy,
            precision=precision,
            recall=recall,
            f1=f1,
            roc_auc=roc_auc,
            created_at=datetime.datetime.now()
        )
        db.add(new_model)
        db.commit()

        return {
            "message": "Modelo entrenado y almacenado con éxito.",
            "metrics": {
                "accuracy": accuracy,
                "precision": precision,
                "recall": recall,
                "f1": f1,
                "roc_auc": roc_auc
            },
            "model_path": filepath
        }

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
