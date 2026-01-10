import mongoose from 'mongoose';
// import { AttendanceStatus } from '../types/enum.types';

// const attendanceSchema = new mongoose.Schema(
//     {
//         student: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'student',
//             required: true
//         },
//         class: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'class',
//             required: true
//         },
//         course: {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: 'course',
//             required: true
//         },
//         date: {
//             type: Date,
//             required: true
//         },
//         status: {
//             type: String,
//             enum: Object.values(AttendanceStatus),
//             required: true
//         },
//         remarks: {
//             type: String,
//             default: ''
//         }
//     },
//     {
//         timestamps: true
//     }
// );

// const Attendance = mongoose.model('attendance', attendanceSchema);

// export default Attendance;




const attendanceSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  date: {
    type: String, // "YYYY-MM-DD"
    required: true
  },
  status: {
    type: String,
    enum: ['PRESENT', 'ABSENT', 'LEAVE'],
    required: true
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

attendanceSchema.index(
  { student: 1, course: 1, date: 1 },
  { unique: true }
);

export default mongoose.model('Attendance', attendanceSchema);
