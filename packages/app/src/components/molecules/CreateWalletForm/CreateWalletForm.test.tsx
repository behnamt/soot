import React from 'react';
import { CreateWalletForm } from './CreateWalletForm';
import { shallow } from 'enzyme';

it('should find the title', () => {
  const wrapper = shallow(<CreateWalletForm onSubmittableChanged={jest.fn} />);

  expect(wrapper.text()).toEqual('To start using the app, create your own wallet');
});
