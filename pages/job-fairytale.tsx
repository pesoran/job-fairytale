
import React, { useState } from "react";
import axios from "axios";

export default function JobFairytale() {
  const [job, setJob] = useState("");
  const [words, setWords] = useState<string[]>([]);
  const [story, setStory] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const storyRes = await axios.post("/api/generate-story", { job, words });
      setStory(storyRes.data);

      const imgUrls: string[] = [];
      for (const chapter of storyRes.data) {
        const imageRes = await axios.post("/api/generate-image", { prompt: chapter.title });
        imgUrls.push(imageRes.data.url);
      }
      setImages(imgUrls);
    } catch (err) {
      console.error(err);
      alert("동화 생성에 실패했습니다.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">직업 동화 만들기</h1>

      <div className="mb-4">
        <label className="block font-medium">직업 선택</label>
        <input
          type="text"
          value={job}
          onChange={(e) => setJob(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">직업 관련 영어 단어 (쉼표로 구분)</label>
        <input
          type="text"
          placeholder="e.g. stethoscope, surgeon, anatomy"
          onChange={(e) => setWords(e.target.value.split(",").map((w) => w.trim()))}
          className="border p-2 w-full"
        />
      </div>

      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "생성 중..." : "동화 생성하기"}
      </button>

      {story.length > 0 && (
        <div className="mt-8 space-y-10">
          {story.map((chapter, idx) => (
            <div key={idx} className="border p-4 rounded shadow">
              {images[idx] && (
                <img
                  src={images[idx]}
                  alt={\`Chapter \${idx + 1} illustration\`}
                  className="mb-4 w-full rounded"
                />
              )}
              <h2 className="text-xl font-semibold mb-2">{chapter.title}</h2>
              <p>{chapter.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
