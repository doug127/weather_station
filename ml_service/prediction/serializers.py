from rest_framework import serializers
from .models import TrainedModel, PredictModel

class TrainedModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainedModel
        fields = '__all__'

class PredictModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredictModel
        fields = '__all__'