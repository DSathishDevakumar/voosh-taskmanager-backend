const LIVE = false;

module.exports = {
    url: LIVE ? "mongodb+srv://sathish19981127:Mongodb27@cluster0.91220iv.mongodb.net/taskmanager?retryWrites=true&w=majority&appName=Cluster0" : 'mongodb://localhost:27017/taskmanager',
    hostname: "0.0.0.0",
    port: "4001"
}
