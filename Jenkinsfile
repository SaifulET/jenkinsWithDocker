pipeline {
    agent any

    environment {
        IMAGE_NAME = 'mern-api'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        CONTAINER_NAME = "mern-api-test-${env.BUILD_NUMBER}"
    }

    stages {
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
                    // Sibling container run via DooD
                    sh "docker run -d --name ${CONTAINER_NAME} -p 5000:5000 ${IMAGE_NAME}:${IMAGE_TAG}"
                    sleep 3

                    // Testing ES6 API Endpoints
                    sh "curl -f http://localhost:5000/health"
                    sh "curl -f http://localhost:5000/"
                }
            }
        }
    }

    post {
        always {
            // Clean up sibling container & image from host
            sh "docker rm -f ${CONTAINER_NAME} || true"
            sh "docker rmi -f ${IMAGE_NAME}:${IMAGE_TAG} || true"
        }
    }
}
