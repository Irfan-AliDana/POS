const HeavyComponent = () => {
    // Blocking UI for demonstration purposes
    const generateData = () => {
        // Simulating heavy computation by blocking the UI
        const data = [];
        for (let i = 0; i < 20000; i++) {
            data.push(`Item ${i + 1}`);
        }
        return data;
    };

    const data = generateData();

    return (
        <div>
            <h2>Heavy Component</h2>
            <ul>
                {data.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default HeavyComponent;
