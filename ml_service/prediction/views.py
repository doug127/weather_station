from rest_framework.views import APIView
from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import TrainedModel, PredictModel
from .serializers import TrainedModelSerializer, PredictModelSerializer
from .utils import structure_data, structure_data_single_row, train_model, make_prediction, load_latest_model
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import numpy as np
import os
import joblib
from datetime import datetime

class TrainedModelViewSet(viewsets.ModelViewSet):
    queryset = TrainedModel.objects.all()
    serializer_class = TrainedModelSerializer

class TrainedModelView(APIView):
    def post(self, request):
        model_name = request.data.get('model_name')
        json_data = request.data.get('json_data')
        targets = request.data.get('targets', [])

        if not model_name or not json_data or not targets:
            return Response(
                {'error': 'model_name, json_data y targets son requeridos'},
                status=400
            )

        try:
            df = structure_data(json_data)
            models, metrics = train_model(df, targets=targets)
        except Exception as e:
            import traceback
            print("❌ Error en entrenamiento:")
            traceback.print_exc()
            return Response({'error': str(e)}, status=400)

        # Guardar todos los modelos en un solo archivo
        MODEL_DIR = "./storage"
        os.makedirs(MODEL_DIR, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        file_path = os.path.join(MODEL_DIR, f"{model_name}_{timestamp}.joblib")
        joblib.dump(models, file_path)  # 👈 ahora guarda varios modelos

        model_instance = TrainedModel.objects.create(
            model_name=model_name,
            path_to_file=file_path,
            metrics=metrics,
            target_variables=targets
        )

        return Response({
            'message': 'Trained models saved successfully',
            'data': TrainedModelSerializer(model_instance).data
        }, status=201)


class PredictModelViewSet(viewsets.ModelViewSet):
    queryset = PredictModel.objects.all()
    serializer_class = PredictModelSerializer

class PredictModelView(APIView):
    def post(self, request):
        try:
            json_data = request.data

            if not json_data or "data" not in json_data:
                return Response(
                    {"error": "El body debe contener una clave 'data' con los sensores"}, 
                    status=400
                )

            data_list = json_data["data"]
            if not isinstance(data_list, list) or len(data_list) != 1:
                return Response(
                    {"error": "Se esperaba una lista con exactamente una fila"}, 
                    status=400
                )

            df = structure_data_single_row(data_list)

            # Cargar último modelo
            last_model, models_dict = load_latest_model()

            # Seleccionar target
            target_name = last_model.target_variables[0]  # por ejemplo el primero
            model = models_dict[target_name]

            # Generar predicción
            pred, used_features = make_prediction(model, df)

            # Guardar en la BD
            prediction_instance = PredictModel.objects.create(
                trained_model=last_model,
                predictions={
                    "input_data": data_list[0],
                    "prediction_value": pred
                }
            )

            return Response({
                "message": "Predicción generada con éxito",
                "prediction": prediction_instance.predictions,
                "features_used": used_features,
                "model_used": last_model.model_name
            }, status=200)

        except Exception as e:
            import traceback
            print("❌ Error en predicción:")
            traceback.print_exc()
            return Response({"error": str(e)}, status=500)