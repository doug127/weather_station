from rest_framework.views import APIView
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import TrainedModel, PredictModel
from .serializers import TrainedModelSerializer, PredictModelSerializer
from .utils import structure_data, train_model_rf, make_prediction, load_latest_model
from sklearn.metrics import confusion_matrix, recall_score, f1_score, mean_squared_error
import os
import joblib
from datetime import datetime

class TrainedModelViewSet(viewsets.ModelViewSet):
    queryset = TrainedModel.objects.all()
    serializer_class = TrainedModelSerializer

class TrainedModelView(APIView):
    def post(self, request):
        # print('POST recibido con data:', request.data)

        model_name = request.data.get('model_name')
        json_data = request.data.get('json_data')

        if not model_name or not json_data:
            return Response({'error': 'model_name y json_data son requeridos'}, status=400)
        
        try:
            df = structure_data(json_data)
            model, y_true, y_pred, date = train_model_rf(df)
        except Exception as e:
            import traceback
            print("❌ Error en structure_data o train_model_rf:")
            traceback.print_exc()
            return Response({'error': str(e)}, status = 400)
    
        tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
        rain_pred = int((y_pred == 1).sum())
        no_rain_pred = int((y_pred == 0).sum())

        rain_recall = recall_score(y_true, y_pred, pos_label=1)
        no_rain_recall = recall_score(y_true, y_pred, pos_label=0)

        rain_f1 = f1_score(y_true, y_pred, pos_label=1)
        no_rain_f1 = f1_score(y_true, y_pred, pos_label=0)

        mse = round(float(mean_squared_error(y_true, y_pred)), 2)

        MODEL_DIR = "./storage"
        os.makedirs(MODEL_DIR, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        file_path = os.path.join(MODEL_DIR, f"{model_name}_{timestamp}.joblib")
        joblib.dump(model, file_path)

        model_instance = TrainedModel.objects.create(
            model_name=model_name,
            path_to_file=file_path,
            tp=tp, tn=tn, fp=fp, fn=fn,
            rain_pred=rain_pred, no_rain_pred=no_rain_pred,
            rain_recall=rain_recall, no_rain_recall=no_rain_recall,
            rain_f1_score=rain_f1, no_rain_f1_score=no_rain_f1,
            json_data=json_data, mse=mse
        )

        return Response({
                'message': 'Trained model and saved successfully',
                'data': TrainedModelSerializer(model_instance).data,
            }, status=201)


class PredictModelViewSet(viewsets.ModelViewSet):
    queryset = PredictModel.objects.all()
    serializer_class = PredictModelSerializer

class PredictModelView(APIView):
    def post(self, request):
        try:
            json_data = request.data.get('json_data')
            if not json_data:
                return Response({'error': 'json_data es requerido'}, status=400)
            # Convertir JSON a DataFrame
            df = structure_data(json_data)

            # Asegurar que solo haya una fila (ej. fecha filtrada)
            if len(df) != 1:
                return Response({'error': 'Se esperaba una sola fila para predicción'}, status=400)

            # Cargar último modelo entrenado
            last_model, model = load_latest_model()

            # Hacer predicción
            pred, prob, trust, used_features = make_prediction(model, df, json_data)

            # Guardar en BD
            prediction_instance = PredictModel.objects.create(
                trained_model=last_model,
                rain_pred=bool(pred),
                probability=round(prob, 4),
                trust=round(trust, 4)
            )

            return Response({
                'message': 'Predicción generada con éxito',
                'rain_pred': bool(pred),
                'probability': round(prob, 4),
                'trust': round(trust, 4),
                'features_used': used_features,
                'model_used': last_model.model_name
            }, status=200)

        except Exception as e:
            import traceback
            print("❌ Error en predicción:")
            traceback.print_exc()
            return Response({'error': str(e)}, status=500)

