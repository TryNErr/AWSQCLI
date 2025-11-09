exports.handler = async (event) => {
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        }
    };

    try {
        const path = event.path || event.rawPath;
        
        if (path === '/health') {
            response.body = JSON.stringify({
                message: 'Quiz App Backend is running!',
                timestamp: new Date().toISOString()
            });
        } else {
            response.body = JSON.stringify({
                message: 'Quiz App API',
                endpoints: ['/health']
            });
        }
    } catch (error) {
        response.statusCode = 500;
        response.body = JSON.stringify({
            error: 'Internal server error',
            message: error.message
        });
    }

    return response;
};
