#!/bin/bash

echo "🗄️  TestAce Database Management"
echo "=============================="

case "$1" in
    start)
        echo "🐳 Starting MongoDB container..."
        docker-compose -f docker-compose.local.yml up -d mongodb
        echo "⏳ Waiting for MongoDB to be ready..."
        sleep 10
        echo "✅ MongoDB is running on localhost:27017"
        ;;
    stop)
        echo "🛑 Stopping MongoDB container..."
        docker-compose -f docker-compose.local.yml stop mongodb
        echo "✅ MongoDB container stopped"
        ;;
    restart)
        echo "🔄 Restarting MongoDB container..."
        docker-compose -f docker-compose.local.yml restart mongodb
        echo "⏳ Waiting for MongoDB to be ready..."
        sleep 10
        echo "✅ MongoDB restarted"
        ;;
    logs)
        echo "📋 MongoDB container logs:"
        docker logs testace-mongodb-local
        ;;
    shell)
        echo "🐚 Opening MongoDB shell..."
        docker exec -it testace-mongodb-local mongosh testace
        ;;
    status)
        if docker ps | grep -q testace-mongodb-local; then
            echo "✅ MongoDB container is running"
            docker ps | grep testace-mongodb-local
        else
            echo "❌ MongoDB container is not running"
        fi
        ;;
    clean)
        echo "🧹 Cleaning up MongoDB data (this will delete all data)..."
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose -f docker-compose.local.yml down -v
            echo "✅ MongoDB data cleaned"
        else
            echo "❌ Operation cancelled"
        fi
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|logs|shell|status|clean}"
        echo ""
        echo "Commands:"
        echo "  start   - Start MongoDB container"
        echo "  stop    - Stop MongoDB container"
        echo "  restart - Restart MongoDB container"
        echo "  logs    - Show MongoDB container logs"
        echo "  shell   - Open MongoDB shell"
        echo "  status  - Check MongoDB container status"
        echo "  clean   - Remove MongoDB container and data (destructive)"
        exit 1
        ;;
esac
