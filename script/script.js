const colorTheme = document.querySelector('#color-theme');
const buttons = document.querySelectorAll('button');
const measurements = document.querySelectorAll('.measurement');
const inputs = document.querySelectorAll('input');
const inputTemp1 = document.querySelector('#temperature .from input');
const inputTemp2 = document.querySelector('#temperature .to input');
const inputWeight1 = document.querySelector('#weight .from input');
const inputWeight2 = document.querySelector('#weight .to input');
const inputSpeed1 = document.querySelector('#speed .from input');
const inputSpeed2 = document.querySelector('#speed .to input');
const inputLength1 = document.querySelector('#length .from input');
const inputLength2 = document.querySelector('#length .to input');
const inputVolume1 = document.querySelector('#volume .from input');
const inputVolume2 = document.querySelector('#volume .to input');

// Temperature convert
const convertTemperature = () => {
    const select1 = document.querySelector('#temperature-select-from');

    if (select1.value === 'Fahrenheit') {
        inputTemp2.value = (((inputTemp1.value - 32) * 5) / 9).toFixed(1);
    } else {
        inputTemp2.value = ((inputTemp1.value * 9) / 5 + 32).toFixed(1);
    }

    if (inputTemp1.value === '') inputTemp2.value = '';
};

// Weight convert
const convertWeight = () => {
    const select1 = document.querySelector('#weight-select-from');

    if (select1.value === 'Pounds') {
        inputWeight2.value = (inputWeight1.value * 453.59237).toFixed(2);
    } else {
        inputWeight2.value = (inputWeight1.value / 453.59237).toFixed(2)
    }

    if (inputWeight1.value === '') inputWeight2.value = '';
};


// Length convert
const convertLength = () => {
    const select1 = document.querySelector('#length-select-from');
    
    if (select1.value === 'Inches') {
        inputLength2.value = (inputLength1.value * 2.54).toFixed(1);
    } else {
        inputLength2.value = (inputLength1.value / 2.54).toFixed(1);
    }
    
    if (inputLength1.value === '') inputLength2.value = '';
};

// Volume convert
const convertVolume = () => {
    const select1 = document.querySelector('#volume-select-from');
    
    if (select1.value === 'Ounces') {
        inputVolume2.value = (inputVolume1.value * 29.5735).toFixed(1);
    } else {
        inputVolume2.value = (inputVolume1.value / 29.5735).toFixed(1);
    }
    
    if (inputVolume1.value === '') inputVolume2.value = '';
};

// Speed convert
const convertSpeed = () => {
    const select1 = document.querySelector('#speed-select-from');

    if (select1.value === 'Kilometers') {
        inputSpeed2.value = (inputSpeed1.value * 0.621371).toFixed(1);
    } else {
        inputSpeed2.value = (inputSpeed1.value * 1.60934).toFixed(1);
    }

    if (inputSpeed1.value === '') inputSpeed2.value = '';
};

// Theme switch
const themeSwitch = () => {
    let color;

    switch (colorTheme.value) {
        case 'Purple':
            color = 'purple';
            break;
        case 'Green':
            color = 'green';
            break;
        case 'Cyan':
            color = 'cyan';
            break;
        case 'Red':
            color = 'red';
            break;
        case 'Orange':
            color = 'orange';
            break;
        case 'Yellow':
            color = 'yellow';
            break;
        case 'Blue':
            color = '#0077ff';
            break;
    }

    document.documentElement.style.setProperty('--theme-color', color);
};

// Active button
const active = (event) => {
    const measurements = document.querySelectorAll('.measurement');
    measurements.forEach((measurement) =>
        measurement.classList.remove('active')
    );

    buttons.forEach((button) => (button.style.color = '#fff'));

    const button = event.currentTarget;

    const targetId = button.getAttribute('data-target');
    document.getElementById(targetId).classList.add('active');

    button.style.color = 'var(--theme-color)';
};

// Unit change
const unitChange = (changed, other) => {
    if (changed.value === other.value) {
        const differentOption = [...other.options].find(
            (opt) => opt.value !== changed.value
        );

        other.value = differentOption.value;
    }

    inputs.forEach((input) => (input.value = ''));
};

// Event Listeners
colorTheme.addEventListener('change', themeSwitch);

buttons.forEach((button) => {
    button.addEventListener('click', active);
});

measurements.forEach((container) => {
    const from = container.querySelector('.from select');
    const to = container.querySelector('.to select');
    if (!from || !to) return;

    from.addEventListener('change', () => unitChange(from, to));
    to.addEventListener('change', () => unitChange(to, from));
});

inputTemp1.addEventListener('input', () => convertTemperature());
inputWeight1.addEventListener('input', () => convertWeight());
inputSpeed1.addEventListener('input', () => convertSpeed());
inputLength1.addEventListener('input', () => convertLength());
inputVolume1.addEventListener('input', () => convertVolume())
