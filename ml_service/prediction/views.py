from rest_framework.views import APIView
from rest_framework import viewsets, status
from rest_framework.response import Response
import numpy as np
from sklearn.metrics import confusion_matrix, recall_score, f1_score, mean_squared_error

from .models import TrainedModel, PredictModel
from .serializers import TrainedModelSerializer, PredictModelSerializer


class TrainedModelViewSet(viewsets.ModelViewSet):
    queryset = TrainedModel.objects.all()
    serializer_class = TrainedModelSerializer

class TrainedModelView(APIView):
    def post(self, request):
        model_name = request.data.get('model_name')
        json_data = request.data.get('json_data')

        if not model_name or not json_data:
            return Response({'error': 'model_name y json_data son requeridos'}, status=400)
        
        try:
            data_blocks = json_data.get('data', [])
            values = [v['value'] for block in data_blocks for v in block['values']]
        except Exception as e:
            return Response({'error': 'Estructura invalida del JSON'}, status = 400)
    
        X = np.array(values).reshape(-1, 1)
        y_true = np.random.choice([0, 1], size=len(values))

        y_pred = np.random.choice([0,1], size = len(values))

        tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
        rain_pred = int(np.sum(y_pred == 1))
        no_rain_pred = int(np.sum(y_pred == 0))

        rain_recall = recall_score(y_true, y_pred, pos_label=1)
        no_rain_recall = recall_score(y_true, y_pred, pos_label=0)

        rain_f1 = f1_score(y_true, y_pred, pos_label=1)
        no_rain_f1 = f1_score(y_true, y_pred, pos_label=0)

        mse = float(mean_squared_error(y_true, y_pred))
        msa = 1 - mse  # métrica inventada: precisión inversa

        # Guardar en DB
        model = TrainedModel.objects.create(
            model_name=model_name,
            json_data=json_data,
            tp=tp, tn=tn, fp=fp, fn=fn,
            rain_pred=rain_pred, no_rain_pred=no_rain_pred,
            rain_recall=rain_recall, no_rain_recall=no_rain_recall,
            rain_f1_score=rain_f1, no_rain_f1_score=no_rain_f1,
            mse=mse, msa=msa
        )

        return Response({
                'message': 'data created',
                'data': TrainedModelSerializer(model).data,
            }, status=201)


class PredictModelViewSet(viewsets.ModelViewSet):
    queryset = PredictModel.objects.all()
    serializer_class = PredictModelSerializer