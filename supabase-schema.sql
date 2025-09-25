-- Supabase Database Schema for Drift Survey

-- 1. Create surveys table
CREATE TABLE surveys (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    questions JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create user responses table
CREATE TABLE responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_session UUID NOT NULL,
    survey_id VARCHAR(255) REFERENCES surveys(id) ON DELETE CASCADE,
    answers JSONB NOT NULL,
    coordinates POINT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create archive points view for efficient querying
CREATE VIEW archive_points AS
SELECT
    id,
    user_session,
    survey_id,
    UNNEST(coordinates) as point,
    created_at
FROM responses;

-- 4. Create indexes for better performance
CREATE INDEX idx_responses_survey_id ON responses(survey_id);
CREATE INDEX idx_responses_created_at ON responses(created_at);
CREATE INDEX idx_responses_user_session ON responses(user_session);

-- 5. Insert initial survey data
INSERT INTO surveys (id, title, questions) VALUES (
    'drift-survey-v1',
    'Drift Survey v1.0',
    '{
        "questions": [
            {
                "id": "movement",
                "text": "당신에게 \"움직임\"을 표현하는 단어는?",
                "answers": [
                    {"id": "ripple", "text": "파문", "coordinates": {"x": 0.2, "y": 0.8}},
                    {"id": "vibration", "text": "진동", "coordinates": {"x": 0.7, "y": 0.6}},
                    {"id": "rotation", "text": "회전", "coordinates": {"x": 0.5, "y": 0.3}},
                    {"id": "dance", "text": "춤", "coordinates": {"x": 0.9, "y": 0.9}},
                    {"id": "pulse", "text": "맥박", "coordinates": {"x": 0.1, "y": 0.4}}
                ]
            },
            {
                "id": "boundary",
                "text": "기억 속에서 가장 인상적인 \"경계\"는?",
                "answers": [
                    {"id": "horizon", "text": "수평선", "coordinates": {"x": 0.8, "y": 0.2}},
                    {"id": "threshold", "text": "문턱", "coordinates": {"x": 0.3, "y": 0.7}},
                    {"id": "shadow", "text": "그림자", "coordinates": {"x": 0.6, "y": 0.1}},
                    {"id": "fog", "text": "안개", "coordinates": {"x": 0.4, "y": 0.9}},
                    {"id": "window", "text": "창문", "coordinates": {"x": 0.9, "y": 0.5}}
                ]
            },
            {
                "id": "flow",
                "text": "당신에게 \"흐름\"이란?",
                "answers": [
                    {"id": "river", "text": "강물", "coordinates": {"x": 0.1, "y": 0.6}},
                    {"id": "wind", "text": "바람", "coordinates": {"x": 0.7, "y": 0.8}},
                    {"id": "time", "text": "시간", "coordinates": {"x": 0.5, "y": 0.1}},
                    {"id": "music", "text": "음악", "coordinates": {"x": 0.9, "y": 0.3}},
                    {"id": "breath", "text": "호흡", "coordinates": {"x": 0.3, "y": 0.4}}
                ]
            },
            {
                "id": "space",
                "text": "가장 편안한 \"공간\"은?",
                "answers": [
                    {"id": "ocean", "text": "바다", "coordinates": {"x": 0.2, "y": 0.3}},
                    {"id": "forest", "text": "숲", "coordinates": {"x": 0.6, "y": 0.7}},
                    {"id": "sky", "text": "하늘", "coordinates": {"x": 0.8, "y": 0.9}},
                    {"id": "room", "text": "방", "coordinates": {"x": 0.4, "y": 0.2}},
                    {"id": "memory", "text": "기억 속", "coordinates": {"x": 0.9, "y": 0.6}}
                ]
            },
            {
                "id": "emotion",
                "text": "지금 이 순간 느끼는 감정에 가장 가까운 색은?",
                "answers": [
                    {"id": "blue", "text": "푸른색", "coordinates": {"x": 0.3, "y": 0.8}},
                    {"id": "gold", "text": "금색", "coordinates": {"x": 0.7, "y": 0.4}},
                    {"id": "silver", "text": "은색", "coordinates": {"x": 0.5, "y": 0.6}},
                    {"id": "purple", "text": "보라색", "coordinates": {"x": 0.8, "y": 0.7}},
                    {"id": "transparent", "text": "투명", "coordinates": {"x": 0.1, "y": 0.1}}
                ]
            }
        ]
    }'::jsonb
);

-- 6. Enable Row Level Security (optional, for production)
-- ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- 7. Create policies for public read access (optional)
-- CREATE POLICY "Allow public read access to surveys" ON surveys FOR SELECT USING (true);
-- CREATE POLICY "Allow public read access to responses" ON responses FOR SELECT USING (true);
-- CREATE POLICY "Allow public insert access to responses" ON responses FOR INSERT WITH CHECK (true);