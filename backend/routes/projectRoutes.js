

const express = require('express');
const router = express.Router();
const Project = require('../models/Project'); // Proje modelini import edin
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, authorize } = require('../middleware/auth');


// Multer yapılandırması
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads/projects/';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: function (req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return cb(new Error('Sadece resim dosyaları yüklenebilir!'));
        }
        cb(null, true);
    }
});
// Tüm kayıtları getir - Sadece admin
router.get('/', protect, async (req, res) => {
    try {
        console.log('GET /api/projects endpoint çağrıldı');
        const projects = await Project.find().populate('typeofActivityId', 'name');
        if (!projects || projects.length === 0) {
            return res.status(404).json({ success: false, message: 'Proje bulunamadı' });
        }
        console.log('Projeler:', projects); // Projeleri loglayın
        // Projeleri populate ile doldurun
        res.json({ 
            success: true, 
            projects 
        });
    } catch (error) {
        console.error('Projeleri çekerken hata:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});
// Tüm kayıtları getir
router.get('/projectList', async (req, res) => {
    try {
        const projects = await Project.find().populate('typeofActivityId', 'name');
        res.json({ 
            success: true, 
            projects 
        });
    } catch (error) {
        console.error('Projeleri çekerken hata:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// // Proje türüne göre projeleri getir
// router.get('/projectsByCategory', async (req, res) => {
//     try {
//         console.log('GET /api/projects/projectsByCategory endpoint çağrıldı');
//         console.log('Query:', req.query); // Gelen sorgu parametrelerini loglayın

//         const { categoryTypeId } = req.query;

//         if (!categoryTypeId) {
//             return res.status(400).json({ success: false, message: 'categoryTypeId gerekli' });
//         }

//         const projects = await Project.find({ typeofActivityId: mongoose.Types.ObjectId(categoryTypeId) });
//         console.log('Projeler:', projects); // Projeleri loglayın
//         if (projects.length === 0) {
//             console.log('Proje bulunamadı'); // Proje bulunamadığında loglayın
//             return res.status(404).json({ success: false, message: 'Proje bulunamadı' });
//         }
//         res.json({ 
//             success: true, 
//             projects 
//         });
//     } catch (error) {
//         console.error('Projeler alınırken hata:', error);
//         res.status(500).json({ success: false, message: 'Projeler alınamadı' });
//     }
// });

// Tek kayıt getir
router.get('/:id', protect, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: 'Kayıt bulunamadı' });
        }
        res.json({ 
            success: true, 
            project 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Yeni Kayıt oluştur - Sadece admin
router.post('/', protect, authorize('admin'), upload.array('images'), async (req, res) => {
    try {
        const { name, statusType, description, projectCost, isVisibleCost, typeofActivityId, currencyType , startDate,endDate } = req.body;
        if (!name || !statusType || !projectCost || !startDate) {
            return res.status(400).json({
                success: false,
                message: 'Lütfen tüm zorunlu alanları doldurun'
            });
        }

        const projectData = new Project({
            name,
            statusType,
            description,
            projectCost: parseFloat(projectCost),
            isVisibleCost:isVisibleCost,
            currencyType: currencyType || 'TRY', // Varsayılan olarak TRY
            startDate: startDate ? new Date(startDate) : new Date(), // Tarih formatını kontrol et
            endDate: endDate ? new Date(endDate) : new Date(), // Tarih formatını kontrol et
            imageUrls: req.files ? req.files.map(file => '/uploads/projects/' + file.filename) : [],            
        });

        if (typeofActivityId) {
            project.typeofActivityId = typeofActivityId;
        }
        const project = new Project(projectData);
        await project.save();

        res.status(201).json({ 
            success: true, 
            project 
        });
    } catch (error) {
        if (req.files) {
            req.files.forEach(file => {
                const filePath = path.join(__dirname, '..', file.path);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
        }
        // fs.unlinkSync(req.file.path);
        
        res.status(400).json({ 
            success: false, 
            message: error.message });
    }
});

// Kaydı güncelle - Sadece admin
router.put('/:id', protect, authorize('admin'),upload.array('images'), async (req, res) => {
    
    try {        
        const { name, statusType, description, projectCost, isVisibleCost, typeofActivityId, currencyType, startDate,endDate } = req.body;
        console.log('PUT /api/projects/:id endpoint çağrıldı' ,req.body);

        const project = await Project.findById(req.params.id);
        console.log('Güncellenecek proje:', project);

        if (!project) {
            return res.status(404).json({ success: false, message: 'Kayıt bulunamadı' });
        }
        if (!name || !statusType || !projectCost || !startDate) {
            return res.status(400).json({
                success: false,
                message: 'Lütfen tüm zorunlu alanları doldurun'
            });
        }

        project.name = name;
        project.description = description;
        project.statusType = statusType;
        project.projectCost = parseFloat(projectCost); 
        project.isVisibleCost = isVisibleCost;
        project.currencyType = currencyType || 'TRY'; // Varsayılan olarak TRY
        if (typeofActivityId) {
            console.log('typeofActivityId:', typeofActivityId);
            project.typeofActivityId = typeofActivityId;
        }else {
            console.log('typeofActivityId yok');    
        }
        project.startDate = startDate ? new Date(startDate) : project.startDate; // Tarih formatını kontrol et
        project.endDate = endDate ? new Date(endDate) : null; // Tarih formatını kontrol et
       
        const oldImageUrls = project.imageUrls || [];
        
        // Yeni resim yüklenmişse, eski resimleri sil ve yeni resimleri ekle
        if (req.files && req.files.length > 0) {
            const imagePaths = req.files.map(file => '/uploads/projects/' + file.filename);
            if (imagePaths.length > 0) {
                project.imageUrls = imagePaths;
            }
        }
        
        // Eski resimleri silme işlemini yanıt gönderilmeden önce yapın
        if (oldImageUrls.length > 0) {
            oldImageUrls.forEach(file => {
                if (file && typeof file === 'string') {
                    const oldImagePath = path.join(__dirname, '..', file);
                    if (fs.existsSync(oldImagePath)) {
                        if (project.imageUrls.includes(oldImagePath)) {
                            console.log('Eski resim var:', oldImagePath);
                        }else {
                            console.log('Eski resim siliniyor:', oldImagePath); 
                            fs.unlinkSync(oldImagePath);
                        }
                    }
                }
            });
        }
        console.log('Güncellenmiş proje datası:', project);
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id, 
            project, 
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ 
                success: false, 
                message: 'Proje güncellenemedi' 
            });
        }
        res.json({ 
            success: true, 
            project 
        });
         
    } catch (error) {
        console.error('Error updating project:', error);
        // Eğer dosya yüklenirken hata oluşursa, yüklenen dosyaları sil         
        if (req.files) {
            req.files.forEach(file => {
                const filePath = path.join(__dirname, '..', file.path);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
            });
        }
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    } 
});

// Kaydı sil
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        
        if (!project) {
            return res.status(404).json({ success: false, message: 'Ürün bulunamadı' });
        }

        if (project.imageUrls.length > 0) {
            project.imageUrls.forEach(file => {
                if (file && typeof file === 'string') {
                    const imagePath = path.join(__dirname, '..', file);
                    console.log('Eski resim yolu:', imagePath);
                    if (fs.existsSync(imagePath)) {
                        console.log('Eski resim var:', imagePath);
                        fs.unlinkSync(imagePath);
                        console.log('Eski resim silindi:', imagePath);
                    }
                }
            });
        }

        await project.remove();
        res.json({ success: true, message: 'Ürün başarıyla silindi' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;