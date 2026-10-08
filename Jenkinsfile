pipeline {
    agent any

    environment {
        IMAGE_NAME = 'mern-api'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        CONTAINER_NAME = "mern-api-test-${env.BUILD_NUMBER}"
    }

    stages {
        stage('Setup Docker CLI') {
            steps {
                // কন্টেইনারে ডকার ক্লায়েন্ট না থাকলে স্বয়ংক্রিয়ভাবে ইনস্টল করবে
                sh '''
                if ! command -v docker &> /dev/null; then
                    echo "Docker CLI not found! Installing..."
                    apt-get update && apt-get install -y docker.io curl
                else
                    echo "Docker CLI is already installed."
                fi
                '''
            }
        }

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('Test Endpoints') {
            steps {
                script {
                    // হোস্টের নেটওয়ার্কে সিবলিং কন্টেইনার রান করা
                    sh "docker run -d --name ${CONTAINER_NAME} --network host ${IMAGE_NAME}:${IMAGE_TAG}"
                    
                    // সার্ভার রেডি হওয়ার জন্য ৩ সেকেন্ড অপেক্ষা
                    sleep 3

                    // API Endpoints টেস্ট করা
                    sh "curl -f http://localhost:5000/health"
                    sh "curl -f http://localhost:5000/"
                }
            }
        }
    }

    post {
        always {
            // হোস্ট মেশিন থেকে টেস্ট কন্টেইনার ও ইমেজ ক্লিনআপ
            sh "docker rm -f ${CONTAINER_NAME} || true"
            sh "docker rmi -f ${IMAGE_NAME}:${IMAGE_TAG} || true"
        }
        success {
            echo "CI/CD Pipeline executed successfully!"
        }
        failure {
            echo "Pipeline failed! Check the logs above."
        }
    }
}