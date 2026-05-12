export interface Question {
  id: number;
  question: string;
  options: {
    label: string;
    text: string;
  }[];
  correctAnswer: string;
  explanation: string;
}

export const questions: Question[] = [
  {
    id: 1,
    question: "Trong cơ sở dữ liệu quan hệ, khóa ngoài (Foreign Key) dùng để làm gì?",
    options: [
      { label: "A", text: "Để định danh duy nhất mỗi bản ghi trong chính bảng đó." },
      { label: "B", text: "Để thiết lập mối liên kết giữa dữ liệu trong hai bảng với nhau." },
      { label: "C", text: "Để tăng tốc độ tìm kiếm dữ liệu trong bảng." },
      { label: "D", text: "Để mã hóa dữ liệu quan trọng trong bảng." }
    ],
    correctAnswer: "B",
    explanation: "Khóa ngoài được sử dụng để tạo mối quan hệ giữa các bảng bằng cách tham chiếu đến khóa chính của một bảng khác, đảm bảo tính nhất quán của dữ liệu liên kết."
  },
  {
    id: 2,
    question: "Khóa ngoài của một bảng thường tham chiếu đến thành phần nào của bảng khác?",
    options: [
      { label: "A", text: "Khóa chính (Primary Key) của bảng được tham chiếu." },
      { label: "B", text: "Một cột bất kỳ không chứa dữ liệu số." },
      { label: "C", text: "Tên của bảng đó." },
      { label: "D", text: "Khóa ngoài của chính bảng đó." }
    ],
    correctAnswer: "A",
    explanation: "Theo nguyên tắc quan hệ, khóa ngoài của bảng 'Con' phải tham chiếu đến khóa chính của bảng 'Cha' để xác định mối liên kết logic giữa các thực thể."
  },
  {
    id: 3,
    question: "Giả sử bảng LOP có khóa chính là MaLop và bảng HOC_SINH có trường MaLop để biết học sinh thuộc lớp nào. MaLop trong bảng HOC_SINH là:",
    options: [
      { label: "A", text: "Khóa chính." },
      { label: "B", text: "Khóa ngoài." },
      { label: "C", text: "Trường dữ liệu mô tả." },
      { label: "D", text: "Khóa phức hợp." }
    ],
    correctAnswer: "B",
    explanation: "Vì MaLop trong bảng HOC_SINH dùng để tham chiếu đến khóa chính MaLop của bảng LOP, nên nó đóng vai trò là khóa ngoài."
  },
  {
    id: 4,
    question: "Mối quan hệ 1 - Nhiều (1-N) giữa bảng A và bảng B có nghĩa là:",
    options: [
      { label: "A", text: "Một bản ghi ở bảng A chỉ liên kết với duy nhất một bản ghi ở bảng B." },
      { label: "B", text: "Một bản ghi ở bảng A có thể liên kết với nhiều bản ghi ở bảng B, nhưng mỗi bản ghi ở bảng B chỉ liên kết với một bản ghi ở bảng A." },
      { label: "C", text: "Nhiều bản ghi ở bảng A liên kết với nhiều bản ghi ở bảng B." },
      { label: "D", text: "Bảng A và bảng B không có liên quan gì với nhau." }
    ],
    correctAnswer: "B",
    explanation: "Đây là mối quan hệ phổ biến nhất, ví dụ: Một Lớp có nhiều Học sinh, nhưng mỗi Học sinh chỉ thuộc về một Lớp duy nhất."
  },
  {
    id: 5,
    question: "Để giải quyết mối quan hệ Nhiều - Nhiều (N-N) giữa hai bảng, người ta thường làm gì?",
    options: [
      { label: "A", text: "Thêm thật nhiều khóa ngoài vào cả hai bảng." },
      { label: "B", text: "Tạo một bảng trung gian liên kết hai bảng đó qua các khóa ngoài." },
      { label: "C", text: "Gộp hai bảng lại thành một bảng duy nhất." },
      { label: "D", text: "Xóa bớt dữ liệu để trở thành quan hệ 1-1." }
    ],
    correctAnswer: "B",
    explanation: "Quan hệ Nhiều-Nhiều không thể biểu diễn trực tiếp bằng khóa ngoài giữa hai bảng, do đó cần một bảng trung gian (bảng liên kết) chứa khóa chính của cả hai bảng ban đầu."
  },
  {
    id: 6,
    question: "Ràng buộc tham chiếu (Referential Integrity) đảm bảo điều gì?",
    options: [
      { label: "A", text: "Đảm bảo dữ liệu trong bảng luôn được sắp xếp theo thứ tự ABC." },
      { label: "B", text: "Đảm bảo giá trị của khóa ngoài phải tồn tại trong cột khóa chính của bảng được tham chiếu." },
      { label: "C", text: "Đảm bảo mọi ô trong bảng đều phải có dữ liệu số." },
      { label: "D", text: "Đảm bảo không ai có thể xóa được bảng." }
    ],
    correctAnswer: "B",
    explanation: "Ràng buộc tham chiếu ngăn chặn việc tạo ra các bản ghi 'mồ côi' (khóa ngoài trỏ đến một giá trị không tồn tại ở bảng chính)."
  },
  {
    id: 7,
    question: "Khi xóa một bản ghi ở bảng Cha đang được tham chiếu bởi bảng Con, hệ thống thường làm gì?",
    options: [
      { label: "A", text: "Xóa ngay lập tức không thông báo." },
      { label: "B", text: "Báo lỗi hoặc yêu cầu xử lý các bản ghi ở bảng Con trước để đảm bảo tính nhất quán." },
      { label: "C", text: "Tự động tắt máy tính." },
      { label: "D", text: "Biến bảng Con thành bảng Cha." }
    ],
    correctAnswer: "B",
    explanation: "Hệ quản trị CSDL sẽ ngăn việc xóa này để bảo vệ tính toàn vẹn dữ liệu, trừ khi bạn thiết lập quy tắc xóa dây chuyền (Cascade Delete)."
  },
  {
    id: 8,
    question: "Trong Microsoft Access, công cụ nào dùng để thiết lập mối quan hệ giữa các bảng?",
    options: [
      { label: "A", text: "Table Design." },
      { label: "B", text: "Relationships." },
      { label: "C", text: "Query Wizard." },
      { label: "D", text: "Form Design." }
    ],
    correctAnswer: "B",
    explanation: "Cửa sổ Relationships trong Access cho phép kéo thả các trường giữa các bảng để thiết lập và quản lý các mối liên kết."
  },
  {
    id: 9,
    question: "Khi thiết lập quan hệ, hai trường liên kết với nhau PHẢI có đặc điểm gì chung?",
    options: [
      { label: "A", text: "Phải có cùng tên gọi hoàn toàn." },
      { label: "B", text: "Phải có cùng kiểu dữ liệu (Data Type)." },
      { label: "C", text: "Phải có cùng số lượng bản ghi." },
      { label: "D", text: "Phải nằm trên cùng một bảng." }
    ],
    correctAnswer: "B",
    explanation: "Mặc dù tên có thể khác nhau, nhưng kiểu dữ liệu phải tương thích (ví dụ: cả hai cùng là Number hoặc Short Text) để hệ thống có thể so sánh và đối khớp giá trị."
  },
  {
    id: 10,
    question: "Lợi ích chính của việc chia cơ sở dữ liệu thành nhiều bảng có quan hệ là gì?",
    options: [
      { label: "A", text: "Làm cho việc sử dụng máy tính khó khăn hơn." },
      { label: "B", text: "Tránh dư thừa dữ liệu và đảm bảo tính nhất quán khi cập nhật." },
      { label: "C", text: "Để bảng trông đẹp mắt hơn." },
      { label: "D", text: "Vì phần mềm không cho phép tạo bảng có quá nhiều cột." }
    ],
    correctAnswer: "B",
    explanation: "Chuẩn hóa CSDL bằng cách chia bảng giúp loại bỏ việc lặp lại thông tin không cần thiết, giúp việc sửa đổi dữ liệu chỉ cần thực hiện ở một nơi."
  }
];
