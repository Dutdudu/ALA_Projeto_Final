import React, { useState, useEffect } from "react";

type Matrix = number[][];

const generateRandomMatrix = (): Matrix => [
    [Math.floor(Math.random() * 11 - 5), Math.floor(Math.random() * 11 - 5)],
    [Math.floor(Math.random() * 11 - 5), Math.floor(Math.random() * 11 - 5)],
];

const transformVector = (matrix: Matrix, vector: [number, number]) => [
    matrix[0][0] * vector[0] + matrix[0][1] * vector[1],
    matrix[1][0] * vector[0] + matrix[1][1] * vector[1],
];

const drawCartesianPlane = (
    canvas: HTMLCanvasElement,
    matrix: Matrix,
    color: string
) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const originX = width / 2;
    const originY = height / 2;
    const unit = 20; // Pixels per unit

    ctx.clearRect(0, 0, width, height);

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Draw grid
    ctx.strokeStyle = "#ddd";
    for (let x = 0; x < width; x += unit) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    for (let y = 0; y < height; y += unit) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }

    // Draw coordinates
    ctx.fillStyle = "black";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const range = 10; // Number of units visible in each direction
    for (let x = -range; x <= range; x++) {
        for (let y = -range; y <= range; y++) {
            const screenX = originX + x * unit;
            const screenY = originY - y * unit;

            if (x === 0 && y === 0) {
                ctx.fillText("0", screenX, screenY); // Mark origin
            } else if (x === 0) {
                ctx.fillText(y.toString(), screenX, screenY); // Mark y-axis
            } else if (y === 0) {
                ctx.fillText(x.toString(), screenX, screenY); // Mark x-axis
            }
        }
    }

    // Draw transformed parallelogram
    const vectors: [number, number][] = [
        [0, 0], // Origin
        [1, 0], // X-axis vector
        [1, 1], // Diagonal
        [0, 1], // Y-axis vector
    ];
    const transformed = vectors.map((v) => transformVector(matrix, v));

    ctx.strokeStyle = color;
    ctx.beginPath();
    transformed.forEach(([x, y], index) => {
        if (index === 0) {
            ctx.moveTo(originX + x * unit, originY - y * unit);
        } else {
            ctx.lineTo(originX + x * unit, originY - y * unit);
        }
    });
    ctx.closePath();
    ctx.stroke();
};



const App: React.FC = () => {
    const [userMatrix, setUserMatrix] = useState<Matrix>([
        [0, 0],
        [0, 0],
    ]);
    const [randomMatrix, setRandomMatrix] = useState<Matrix>(generateRandomMatrix());
    const [message, setMessage] = useState<string>("");

    const handleMatrixChange = (
        row: number,
        col: number,
        value: string
    ) => {
        const newMatrix = [...userMatrix];
        newMatrix[row][col] = parseFloat(value) || 0;
        setUserMatrix(newMatrix);
    };

    const handleCheckAnswer = () => {
        if (
            JSON.stringify(userMatrix) === JSON.stringify(randomMatrix)
        ) {
            setMessage("Correto! Você acertou a matriz.");
        } else {
            setMessage("Errado! Tente novamente.");
        }
    };

    const handleGenerateNewMatrix = () => {
        setRandomMatrix(generateRandomMatrix());
        setMessage("");
        setUserMatrix([
            [0, 0],
            [0, 0],
        ]);
    };

    useEffect(() => {
        const randomCanvas = document.getElementById(
            "randomMatrixCanvas"
        ) as HTMLCanvasElement;
        const userCanvas = document.getElementById(
            "userMatrixCanvas"
        ) as HTMLCanvasElement;

        if (randomCanvas) {
            drawCartesianPlane(randomCanvas, randomMatrix, "red");
        }
        if (userCanvas) {
            drawCartesianPlane(userCanvas, userMatrix, "blue");
        }
    }, [randomMatrix, userMatrix]);

    return (
        <div style={{ textAlign: "center", fontFamily: "Arial" }}>
            <h1>Escolha a matriz correta</h1>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
                <div>
                    <h2>Matriz Aleatória</h2>
                    <canvas
                        id="randomMatrixCanvas"
                        width="300"
                        height="300"
                        style={{ border: "1px solid black" }}
                    ></canvas>
                </div>
                <div>
                    <h2>Sua Matriz</h2>
                    <canvas
                        id="userMatrixCanvas"
                        width="300"
                        height="300"
                        style={{ border: "1px solid black" }}
                    ></canvas>
                </div>
            </div>
            <div style={{ marginTop: "20px" }}>
                <h3>Digite os valores da matriz:</h3>
                <div>
                    <input
                        type="number"
                        value={userMatrix[0][0]}
                        onChange={(e) => handleMatrixChange(0, 0, e.target.value)}
                    />
                    <input
                        type="number"
                        value={userMatrix[0][1]}
                        onChange={(e) => handleMatrixChange(0, 1, e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="number"
                        value={userMatrix[1][0]}
                        onChange={(e) => handleMatrixChange(1, 0, e.target.value)}
                    />
                    <input
                        type="number"
                        value={userMatrix[1][1]}
                        onChange={(e) => handleMatrixChange(1, 1, e.target.value)}
                    />
                </div>
                <button onClick={handleCheckAnswer}>Enviar Resposta</button>
                <button onClick={handleGenerateNewMatrix}>
                    Gerar Nova Matriz
                </button>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
};

export default App;
