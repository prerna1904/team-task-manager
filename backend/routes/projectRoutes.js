const router = require('express').Router();
const { createProject, getProjects, addMember } = require('../controllers/projectController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
router.use(protect);
router.post('/', adminOnly, createProject);
router.get('/', getProjects);
router.put('/:id/members', adminOnly, addMember);
module.exports = router;