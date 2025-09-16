from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PredictModelLatestView, TrainedModelViewSet, PredictModelViewSet, TrainedModelView, PredictModelView

router = DefaultRouter()
router.register(r'trained-models', TrainedModelViewSet)
router.register(r'predictions', PredictModelViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('train-model/', TrainedModelView.as_view(), name='train-model'),
    path('predict-model/', PredictModelView.as_view(), name='predict-model'),
    path('predict-model/latest/', PredictModelLatestView.as_view(), name='predict-model-latest'),
]
