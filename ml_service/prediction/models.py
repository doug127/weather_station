from django.db import models
from django.contrib.postgres.fields import JSONField  # si usas PostgreSQL

class TrainedModel(models.Model):
    model_name = models.CharField(max_length=100)
    
    path_to_file = models.CharField(max_length=255)

    # --- Métricas de regresión ---
    metrics = models.JSONField(default=dict)

    target_variables = models.JSONField(default=dict)

    date_trained = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.model_name


class PredictModel(models.Model):
    trained_model = models.ForeignKey(
        TrainedModel,
        on_delete=models.CASCADE,
        related_name='predictions'
    )

    # --- Predicciones en formato JSON ---
    predictions = models.JSONField()  # aquí guardas todos los valores predichos de sensores

    prediction_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Prediction on {self.prediction_date}'