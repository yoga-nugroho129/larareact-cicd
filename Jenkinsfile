pipeline {
    agent {
        docker {
            image 'docker:cli'
            args '--group-add 988 -v /var/run/docker.sock:/var/run/docker.sock'
        }
    }

    stages {
        stage('Test Docker Agent') {
            steps {
                sh 'docker version'
                sh 'docker ps'
            }
        }
    }
}