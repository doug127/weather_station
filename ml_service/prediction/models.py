from django.db import models

class TrainedModel(models.Model):
    model_name = models.CharField(max_length=100)
    json_data = models.JSONField()

    tp = models.IntegerField()
    tn = models.IntegerField()
    fp = models.IntegerField()
    fn = models.IntegerField()

    rain_pred = models.IntegerField()
    no_rain_pred = models.IntegerField()

    rain_recall = models.FloatField()
    no_rain_recall = models.FloatField()

    rain_f1_score = models.FloatField()
    no_rain_f1_score = models.FloatField()

    mse = models.FloatField()
    msa = models.FloatField()

    date_trained = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.model_name
    
class PredictModel(models.Model):
    trained_model = models.ForeignKey(TrainedModel, on_delete=models.CASCADE, related_name='predictions')

    rain_pred = models.BooleanField()
    probability = models.FloatField()
    trust = models.FloatField()
    prediction_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Prediction on {self.prediction_date}'