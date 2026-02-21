"use client";

import { useState } from "react";

type Operation = number | string;

export default function ScientificCalculator() {
  const [display, setDisplay] = useState("0");
  const [history, setHistory] = useState<string[]>([]);
  const [shouldReset, setShouldReset] = useState(false);

  const handleNumber = (num: string) => {
    if (shouldReset || display === "0") {
      setDisplay(num);
      setShouldReset(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperation = (op: string) => {
    setDisplay(display + op);
    setShouldReset(false);
  };

  const handleFunction = (func: string) => {
    const num = parseFloat(display);
    let result = 0;
    
    switch (func) {
      case "sin":
        result = Math.sin((num * Math.PI) / 180);
        break;
      case "cos":
        result = Math.cos((num * Math.PI) / 180);
        break;
      case "tan":
        result = Math.tan((num * Math.PI) / 180);
        break;
      case "sqrt":
        result = Math.sqrt(num);
        break;
      case "square":
        result = num * num;
        break;
      case "log":
        result = Math.log10(num);
        break;
      case "ln":
        result = Math.log(num);
        break;
      case "factorial":
        result = factorial(num);
        break;
      case "1/x":
        result = 1 / num;
        break;
      case "+/-":
        result = -num;
        break;
    }
    
    setDisplay(formatResult(result));
    setShouldReset(true);
  };

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n <= 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) result *= i;
    return result;
  };

  const formatResult = (num: number): string => {
    if (Number.isInteger(num) && Math.abs(num) < 1e15) return num.toString();
    return num.toPrecision(10).replace(/\.?0+$/, "");
  };

  const calculate = () => {
    try {
      const expr = display.replace(/×/g, "*").replace(/÷/g, "/");
      const result = new Function("return " + expr)();
      setHistory([...history, `${display} = ${formatResult(result)}`].slice(-10));
      setDisplay(formatResult(result));
      setShouldReset(true);
    } catch {
      setDisplay("Error");
    }
  };

  const clear = () => {
    setDisplay("0");
  };

  const backspace = () => {
    if (display.length === 1 || display === "Error") {
      setDisplay("0");
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const buttons = [
    { label: "sin", type: "func" },
    { label: "cos", type: "func" },
    { label: "tan", type: "func" },
    { label: "log", type: "func" },
    { label: "ln", type: "func" },
    { label: "√", type: "func", action: "sqrt" },
    { label: "x²", type: "func", action: "square" },
    { label: "n!", type: "func", action: "factorial" },
    { label: "1/x", type: "func", action: "1/x" },
    { label: "π", type: "const" },
    { label: "e", type: "const" },
    { label: "C", type: "clear" },
    { label: "⌫", type: "backspace" },
    { label: "%", type: "op" },
    { label: "÷", type: "op" },
    { label: "7", type: "num" },
    { label: "8", type: "num" },
    { label: "9", type: "num" },
    { label: "×", type: "op" },
    { label: "4", type: "num" },
    { label: "5", type: "num" },
    { label: "6", type: "num" },
    { label: "-", type: "op" },
    { label: "1", type: "num" },
    { label: "2", type: "num" },
    { label: "3", type: "num" },
    { label: "+", type: "op" },
    { label: "±", type: "func", action: "+/-" },
    { label: "0", type: "num" },
    { label: ".", type: "num" },
    { label: "=", type: "equals" },
  ];

  const handleClick = (btn: typeof buttons[0]) => {
    switch (btn.type) {
      case "num":
        handleNumber(btn.label);
        break;
      case "op":
        handleOperation(btn.label);
        break;
      case "func":
        handleFunction(btn.action || btn.label);
        break;
      case "clear":
        clear();
        break;
      case "backspace":
        backspace();
        break;
      case "equals":
        calculate();
        break;
      case "const":
        if (btn.label === "π") setDisplay(display === "0" ? Math.PI.toString() : display + Math.PI);
        if (btn.label === "e") setDisplay(display === "0" ? Math.E.toString() : display + Math.E);
        break;
    }
  };

  return (
    <main className="container mx-auto max-w-md px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Scientific Calculator
      </h1>

      <div className="rounded-2xl border border-zinc-200 bg-zinc-900 p-4 dark:border-zinc-800">
        <div className="mb-4 rounded-lg bg-zinc-800 p-4 text-right">
          <p className="break-all text-2xl font-bold text-white">{display}</p>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {buttons.map((btn, i) => (
            <button
              key={i}
              onClick={() => handleClick(btn)}
              className={`rounded-lg py-3 text-sm font-medium transition-colors ${
                btn.type === "num"
                  ? "bg-zinc-700 text-white hover:bg-zinc-600"
                  : btn.type === "op"
                  ? "bg-orange-500 text-white hover:bg-orange-600"
                  : btn.type === "func"
                  ? "bg-zinc-600 text-cyan-400 hover:bg-zinc-500"
                  : btn.type === "equals"
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-zinc-600 text-white hover:bg-zinc-500"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {history.length > 0 && (
        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">History</p>
          <div className="space-y-1">
            {history.map((item, i) => (
              <p key={i} className="text-sm text-zinc-500 dark:text-zinc-400">
                {item}
              </p>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
