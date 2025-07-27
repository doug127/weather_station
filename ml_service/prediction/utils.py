import pandas as pd
from collections import defaultdict
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import confusion_matrix, recall_score, f1_score, mean_squared_error
import os
import joblib

def structure_data(json_data):
    struct = defaultdict(dict)

    for block in json_data.get("data", []):
        code = block["code"]
        
        for item in block["values"]:
            date = item["date"]
            value = item["value"]
            struct[date][code] = value
    
    df = pd.DataFrame.from_dict(struct, orient='index')
    df.index = pd.to_datetime(df.index)
    df.sort_index(inplace=True)
    return df

def train_model_rf(df):
    df_model = df.copy()

    date = df_model.index.max()
    df_model['rain'] = (df_model['prcp'] > 0).astype(int)
    df_model['rain_next_day'] = df_model['rain'].shift(-1)

    # Quitamos la última fila que tendrá NaN en rain_next_day
    df_model = df_model.dropna(subset=['rain_next_day'])

    features = [col for col in df_model.columns if col not in ['rain_next_day']]
    X_model = df_model[features]
    y_model = df_model['rain_next_day'].astype(int)

    X_train, X_test, y_train, y_test = train_test_split(X_model, y_model, test_size=0.2, random_state=42)

    rf = RandomForestClassifier(random_state=42)
    param_grid = {
        'n_estimators': [50, 100],
        'max_depth': [None, 10, 20],
        'min_samples_split': [2, 5],
        'min_samples_leaf': [1, 2],
        'max_features': ['sqrt']
    }

    grid_search = GridSearchCV(estimator=rf, param_grid=param_grid,
                               cv=5, scoring='accuracy', n_jobs=max(1, os.cpu_count() - 2))
    grid_search.fit(X_train, y_train)

    best_model = grid_search.best_estimator_
    y_pred = best_model.predict(X_test)

    return best_model, y_test, y_pred, date

def load_latest_model():
    from prediction.models import TrainedModel
    last_model = TrainedModel.objects.latest("date_trained")
    model_path = last_model.path_to_file
    model = joblib.load(model_path)
    return last_model, model

def make_prediction(model, df, json_data):
    df['rain'] = (df['prcp'] > 0).astype(int)
    used_features = model.feature_names_in_

    missing = [f for f in used_features if f not in df.columns]
    if missing:
        raise ValueError(f"Faltan columnas en el DataFrame: {missing}")
    
    X = df[used_features]

    pred = model.predict(X)[0]
    prob = model.predict_proba(X)[0][1]
    trust = max(model.predict_proba(X)[0])
    return pred, prob, trust, list(used_features)
