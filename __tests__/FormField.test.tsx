{/*
Deliverable 10: Testing
Component test: Verifying that the FormField component renders correctly and handles user input as expected.
Success Criteria: The component displays the correct label, placeholder, and value; it updates the value when the user types in the input field.

I learned how to create this FormField.test.tsx file from the following online resources:
- react-native-lab/blob/main/tests/FormField.test.tsx, Rory Pierce, GitHub Repository, Available at:
https://github.com/rorypierce111/react-native-lab/blob/main/tests/FormField.test.tsx
*/}

import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import FormField from '../components/ui/form-field';

// mocking the themeContext so the component can access colours
jest.mock('@/contexts/themeContext', () => ({
    useTheme: () => ({
        colors: {
            text: '#000000',
            textSecondary: '#666666',
            textMuted: '#999999',
            surface: '#FFFFFF',
            border: '#CCCCCC',
        },
    }),
}));

describe('FormField', () => {
    it('renders the label and fires onChangeText', () => {
        const onChangeTextMock = jest.fn();

        const { getByText, getByLabelText } = render(
            <FormField label="Name" value="" onChangeText={onChangeTextMock} />
        );

        // check if label is rendered correctly
        expect(getByText('Name')).toBeTruthy();

        // check that the input is accesible by its label
        expect(getByLabelText('Name')).toBeTruthy();

        // simulate user typing in the input field and verifying callback firing
        fireEvent.changeText(getByLabelText('Name'), 'Ali');
        expect(onChangeTextMock).toHaveBeenCalledWith('Ali');
    });
});