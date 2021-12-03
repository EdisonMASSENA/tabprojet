module.exports = app => {

    let upload = require('../config/multer.config.js');

    const fileWorker = require('../controllers/file.controller.js');
  
    app.post('/api/file/upload', upload.single("file"), fileWorker.uploadFile);
 
    app.get('/api/file/info', fileWorker.listAllFiles);
     
    app.get('/api/file/:id', fileWorker.downloadFile);
    
    app.delete("/api/file/:id", fileWorker.delete);
  };