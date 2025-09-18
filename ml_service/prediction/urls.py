from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import  TrainedModelView, PredictModelView, TrainedModelViewSet, PredictModelViewSet, LatestPredictModelView
router = DefaultRouter()
router.register(r'trained-models', TrainedModelViewSet)
router.register(r'predictions', PredictModelViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('train-model/', TrainedModelView.as_view(), name='train-model'),
    path('predict-model/', PredictModelView.as_view(), name='predict-model'),
    path('predict-model/latest/', LatestPredictModelView.as_view(), name='latest-predict-model'),
]