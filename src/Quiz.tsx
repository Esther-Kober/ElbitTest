import React, { useState, useEffect } from 'react';
import { Question } from './types';

import { Button } from "antd";

const Quiz: React.FC = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);// Track the question the user is currently on
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));

    useEffect(() => {
        fetch('/questions.json') // Simulating a simple server call
            .then(response => response.json())
            .then(data => {
                setQuestions(data);
            });
    }, []);

    const handleCheckboxChange = (index: number) => {
        const updatedAnswers = [...selectedAnswers];
        updatedAnswers[currentQuestionIndex] = index; // Save the selected answer
        setSelectedAnswers(updatedAnswers);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handleFinish = () => {
        let finalScore = 0;

        // Calculation of the final grade
        questions.forEach((question, index) => {
            const selectedAnswerIndex = selectedAnswers[index];
            if (selectedAnswerIndex !== null && question.answers[selectedAnswerIndex].isCorrect) {
                finalScore += 100 / questions.length; // Calculation of the score - 100 divided by the sum of the questions
            }
        });

        setScore(finalScore); // Updating the final grade
        setQuizCompleted(true); // Mark the quiz as complete
    };

    const handleRestart = () => {
        setScore(0);
        setCurrentQuestionIndex(0);
        setQuizCompleted(false);
        setSelectedAnswers(Array(questions.length).fill(null)); // Initialization of the answers
    };

    if (quizCompleted) {
        return (
            <div>
                <h2>The quiz is over!</h2>
                <p>Your grade: {score.toFixed(0)}%</p>
                <button onClick={handleRestart}>Repeat the quiz</button>
            </div>
        );
    }

    if (questions.length === 0) {
        return <div>Loading questions...</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div>
            <h2>{currentQuestion.question}</h2>
            <ul>
                {currentQuestion.answers.map((answer, index) => (
                    <div key={index}>
                        <input
                            type="checkbox"
                            checked={selectedAnswers[currentQuestionIndex] === index} // Check if this is the selected answer
                            onChange={() => handleCheckboxChange(index)}
                        />
                        {answer.text}
                    </div>
                ))}
            </ul>
            <Button
                onClick={() => {
                    if (currentQuestionIndex > 0) {
                        setCurrentQuestionIndex(currentQuestionIndex - 1);
                    }
                }}
                disabled={currentQuestionIndex === 0}
            >
                Prev
            </Button>
            {currentQuestionIndex === questions.length - 1 ?
                <Button onClick={handleFinish}>Done</Button>
                :
                <Button onClick={handleNext}>
                    Next
                </Button>
            }
        </div>
    );
};

export default Quiz;


