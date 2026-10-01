import { NextRequest, NextResponse } from 'next/server';
import {
  getClassroomDB,
  setActiveUser,
  getActiveUser,
  createClassroom,
  joinClassroomByCode,
  createAssignment,
  submitAssignment,
  gradeSubmission,
  createShared3DView
} from '@/lib/classroomData';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (userId) {
      try {
        setActiveUser(userId);
      } catch (e) {
        // Ignore if user not found, keep default
      }
    }

    const db = getClassroomDB();
    const activeUser = getActiveUser();

    // Compute tailored stats
    const totalClasses = db.classrooms.length;
    const totalStudents = db.classrooms.reduce((acc, c) => acc + c.students.length, 0);
    const totalAssignments = db.assignments.length;
    const totalSubmissions = db.assignments.reduce((acc, a) => acc + a.submissions.length, 0);

    return NextResponse.json({
      success: true,
      activeUser,
      users: db.users,
      classrooms: db.classrooms,
      assignments: db.assignments,
      sharedViews: db.sharedViews,
      stats: {
        totalClasses,
        totalStudents,
        totalAssignments,
        totalSubmissions
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi khi tải dữ liệu lớp học' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'SWITCH_USER') {
      const { userId } = body;
      if (!userId) {
        return NextResponse.json({ error: 'Thiếu userId' }, { status: 400 });
      }
      const user = setActiveUser(userId);
      return NextResponse.json({ success: true, user });
    }

    if (action === 'CREATE_CLASS') {
      const { name, description, lecturerId } = body;
      if (!name) {
        return NextResponse.json({ error: 'Tên lớp học không được để trống' }, { status: 400 });
      }
      const newClass = createClassroom(name, description || '', lecturerId);
      return NextResponse.json({ success: true, classroom: newClass });
    }

    if (action === 'JOIN_CLASS') {
      const { code, studentId } = body;
      if (!code) {
        return NextResponse.json({ error: 'Vui lòng nhập mã lớp học' }, { status: 400 });
      }
      const joinedClass = joinClassroomByCode(code, studentId);
      return NextResponse.json({ success: true, classroom: joinedClass });
    }

    if (action === 'CREATE_ASSIGNMENT') {
      const { classId, title, description, targetPartId, targetPartNameVi, targetSystem, shareViewUrl, dueDate, quizQuestions } = body;
      if (!classId || !title || !targetPartId) {
        return NextResponse.json({ error: 'Vui lòng nhập đầy đủ thông tin bài tập và cấu trúc 3D' }, { status: 400 });
      }
      const newAssignment = createAssignment({
        classId,
        title,
        description: description || '',
        targetPartId,
        targetPartNameVi: targetPartNameVi || targetPartId,
        targetSystem: targetSystem || 'skeletal',
        shareViewUrl,
        dueDate,
        quizQuestions: quizQuestions || []
      });
      return NextResponse.json({ success: true, assignment: newAssignment });
    }

    if (action === 'SUBMIT_ASSIGNMENT') {
      const { assignmentId, studentId, studentName, answers, notes } = body;
      if (!assignmentId || !studentId || !answers) {
        return NextResponse.json({ error: 'Dữ liệu nộp bài không đầy đủ' }, { status: 400 });
      }
      const result = submitAssignment({
        assignmentId,
        studentId,
        studentName: studentName || 'Học viên',
        answers,
        notes
      });
      return NextResponse.json({ success: true, ...result });
    }

    if (action === 'GRADE_SUBMISSION') {
      const { assignmentId, studentId, teacherFeedback, adjustedScore } = body;
      if (!assignmentId || !studentId) {
        return NextResponse.json({ error: 'Thiếu thông tin chấm bài' }, { status: 400 });
      }
      const graded = gradeSubmission({
        assignmentId,
        studentId,
        teacherFeedback: teacherFeedback || '',
        adjustedScore
      });
      return NextResponse.json({ success: true, submission: graded });
    }

    if (action === 'CREATE_SHARED_VIEW') {
      const { title, authorName, authorRole, partId, partNameVi, system, urlHash, description } = body;
      if (!partId || !urlHash) {
        return NextResponse.json({ error: 'Thiếu thông tin góc nhìn 3D' }, { status: 400 });
      }
      const shared = createShared3DView({
        title,
        authorName,
        authorRole,
        partId,
        partNameVi,
        system,
        urlHash,
        description
      });
      return NextResponse.json({ success: true, sharedView: shared });
    }

    return NextResponse.json({ error: 'Hành động không hợp lệ' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi xử lý yêu cầu lớp học' }, { status: 500 });
  }
}
