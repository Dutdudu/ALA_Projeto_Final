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

    const originX = Math.floor(width / 2);
    const originY = Math.floor(height / 2);
    const unit = 20; // Pixels por unidade

    // Ajuste para incluir uma unidade adicional
    const extraUnits = 1; // Quantidade de unidades adicionais
    const newWidth = Math.ceil(width / unit) + extraUnits;
    const newHeight = Math.ceil(height / unit) + extraUnits;

    ctx.clearRect(0, 0, width, height);

    // Desenhar eixos
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY); // Eixo X
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height); // Eixo Y
    ctx.stroke();

    // Desenhar grade com unidades adicionais
    ctx.strokeStyle = "#ddd";
    for (let x = -newWidth * unit; x <= newWidth * unit; x += unit) {
        ctx.beginPath();
        ctx.moveTo(originX + x, 0);
        ctx.lineTo(originX + x, height);
        ctx.stroke();
    }
    for (let y = -newHeight * unit; y <= newHeight * unit; y += unit) {
        ctx.beginPath();
        ctx.moveTo(0, originY + y);
        ctx.lineTo(width, originY + y);
        ctx.stroke();
    }

    // Desenhar coordenadas na grade
    ctx.fillStyle = "black";
    ctx.font = "10px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    for (let x = -newWidth; x <= newWidth; x++) {
        const screenX = originX + x * unit;
        const screenY = originY;

        if (x !== 0) {
            ctx.fillText(x.toString(), screenX, screenY + 10); // Coordenadas do eixo X
        }
    }
    for (let y = -newHeight; y <= newHeight; y++) {
        const screenX = originX;
        const screenY = originY - y * unit;

        if (y !== 0) {
            ctx.fillText(y.toString(), screenX - 10, screenY); // Coordenadas do eixo Y
        }
    }

    // Desenhar paralelogramo transformado
    const vectors: [number, number][] = [
        [0, 0], // Origem
        [1, 0], // Vetor do eixo X
        [1, 1], // Diagonal
        [0, 1], // Vetor do eixo Y
    ];
    const transformed = vectors.map((v) => transformVector(matrix, v));

    transformed.forEach(([x, y], index) => {
        ctx.strokeStyle = ["red", "blue", "green", "orange"][index % 4]; // Lados com cores diferentes
        ctx.beginPath();
        const startX = originX + transformed[index % 4][0] * unit;
        const startY = originY - transformed[index % 4][1] * unit;
        const endX = originX + transformed[(index + 1) % 4][0] * unit;
        const endY = originY - transformed[(index + 1) % 4][1] * unit;

        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    });
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
                <div className="bg-blue-50">
                <button onClick={handleCheckAnswer}>Enviar Resposta</button>
                <button onClick={handleGenerateNewMatrix}>
                
                    Gerar Nova Matriz
                </button>
                </div>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
};

export default App;
