terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 4.80"
    }
  }

  backend "gcs" {
    bucket  = "credenly-tf-state"
    prefix  = "terraform/talentia-state"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

variable "project_id" {
  description = "The GCP Project ID"
  type        = string
}

variable "region" {
  description = "The GCP Region"
  type        = string
  default     = "us-central1"
}

variable "zone" {
  description = "The GCP Zone"
  type        = string
  default     = "us-central1-a"
}

# 1. Conexión a la red VPC existente donde está alojada la MySQL DB de credenly
data "google_compute_network" "vpc_network" {
  name = "credenly-vpc-network"
}

# 2. Subred dedicada para Talentia (Serverless VPC Access connector)
resource "google_compute_subnetwork" "serverless_subnet" {
  name          = "talentia-serverless-subnet"
  ip_cidr_range = "10.0.3.0/28"
  region        = var.region
  network       = data.google_compute_network.vpc_network.id
}

# 3. Artifact Registry Repository (Reutiliza credenly-repo existente)
data "google_artifact_registry_repository" "repo" {
  location      = var.region
  repository_id = "credenly-repo"
}

# 4. Serverless VPC Access Connector de Talentia (Conecta con la VPC existente)
resource "google_vpc_access_connector" "connector" {
  name          = "talentia-vpc-conn"
  region        = var.region
  subnet {
    name = google_compute_subnetwork.serverless_subnet.name
  }
  machine_type  = "e2-micro"
  min_instances = 2
  max_instances = 3
}

# 5. Cloud Run Service para Talentia Backend (NestJS)
# Importante: Nombre independiente 'talentia-backend-nestjs' para NO sobreescribir ni eliminar el backend anterior
resource "google_cloud_run_v2_service" "backend" {
  name     = "talentia-backend-nestjs"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    scaling {
      max_instance_count = 1
    }

    containers {
      image = "us-docker.pkg.dev/cloudrun/container/hello"

      liveness_probe {
        http_get {
          path = "/health"
        }
        initial_delay_seconds = 10
        timeout_seconds       = 2
        period_seconds        = 5
        failure_threshold     = 3
      }
    }
    
    vpc_access {
      connector = google_vpc_access_connector.connector.id
      egress    = "ALL_TRAFFIC"
    }
  }

  lifecycle {
    ignore_changes = [
      template[0].containers[0].image,
      template[0].containers[0].env,
    ]
  }
}

# 6. Permiso de acceso público invoker para el backend de Talentia
resource "google_cloud_run_service_iam_member" "public_access" {
  location = google_cloud_run_v2_service.backend.location
  project  = google_cloud_run_v2_service.backend.project
  service  = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

output "cloud_run_url" {
  value = google_cloud_run_v2_service.backend.uri
}
