const router = require('express').Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
router.use(protect);
router.post('/', createTask);
router.get('/:projectId', getTasks);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
module.exports = router;