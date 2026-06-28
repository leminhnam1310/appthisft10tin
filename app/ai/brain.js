export function generateAIMessage({ activity, page, mood }) {
  if (mood === "sad") {
    return "Mình thấy bạn hơi trầm... muốn nghỉ chút không? 🤍";
  }

  if (activity?.scrollSpeed === "fast") {
    return "Bạn đang vội à? chậm lại chút nhé 👀";
  }

  if (activity?.clicks > 20) {
    return "Bạn đang tương tác nhiều đấy 😄 đang tìm gì vậy?";
  }

  if (page === "dashboard") {
    return "Hôm nay bạn muốn làm gì trước?";
  }

  return "Mình vẫn ở đây nếu bạn cần 🤖";
}