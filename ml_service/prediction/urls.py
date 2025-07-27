from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TrainedModelViewSet, PredictModelViewSet, TrainedModelView

router = DefaultRouter()
router.register(r'trained-models', TrainedModelViewSet)
router.register(r'predictions', PredictModelViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('train-model/', TrainedModelView.as_view(), name='train-model'),
]
