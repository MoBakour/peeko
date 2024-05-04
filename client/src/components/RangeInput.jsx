const RangeInput = ({ onChangeFunction, currentTime, duration }) => {
    const inputValue = (currentTime / duration) * 100 || 0;

    return (
        <input
            type="range"
            className="seek-bar"
            id="seekBar"
            onChange={onChangeFunction}
            min={0}
            max={100}
            value={inputValue}
            style={{
                "--progress": inputValue,
            }}
        />
    );
};

export default RangeInput;
