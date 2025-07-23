import os
import joblib
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from datetime import datetime
import numpy as np

def train_model(df):
    df_model = df.copy()

    prcp_col = next((col for col in df_model.columns if 'prcp' in col.lower()), None)
    if prcp_col is None:
        raise ValueError("No se encontró una columna de precipitación que contenga 'prcp' en su nombre.")
    
    # Crear etiqueta 'llueve' y 'llovera_dia_siguiente'
    df_model['llueve'] = (df_model[prcp_col] > 0).astype(int)
    df_model['llovera_dia_siguiente'] = df_model['llueve'].shift(-1)
    df_model = df_model.dropna(subset=['llovera_dia_siguiente'])

    # Variables predictoras: todas excepto 'prcp' y columnas objetivo
    exclude_cols = [prcp_col, 'llueve', 'llovera_dia_siguiente']
    feature_cols = [col for col in df_model.columns if col not in exclude_cols]

    X_model = df_model[feature_cols]
    y_model = df_model['llovera_dia_siguiente'].astype(int)

    # Dividir en conjunto de entrenamiento y prueba
    X_train, X_test, y_train, y_test = train_test_split(X_model, y_model, test_size=0.2, random_state=42)

    # Definir el modelo y la búsqueda de hiperparámetros
    rf = RandomForestClassifier(random_state=42)
    param_grid = {
        'n_estimators': [50, 100, 200],
        'max_depth': [None, 10, 20, 30],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4],
        'max_features': ['sqrt', 'log2']
    }

    # Configurar núcleos disponibles
    nucleos = max(1, os.cpu_count() - 2)

    grid_search = GridSearchCV(estimator=rf, param_grid=param_grid,
                               cv=5, scoring='accuracy', n_jobs=nucleos)
    grid_search.fit(X_train, y_train)

    best_model = grid_search.best_estimator_
    y_pred = best_model.predict(X_test)
    y_probs = best_model.predict_proba(X_test)[:, 1]
    
    # Guardar modelo entrenado
    model_dir = "trained_models"
    os.makedirs(model_dir, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    model_path = os.path.join(model_dir, f"rain_model_{timestamp}.pkl")
    joblib.dump(best_model, model_path)

    return model_path, y_test, y_pred, y_probs, df_model.index.max()