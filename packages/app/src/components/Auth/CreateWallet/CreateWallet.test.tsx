import React from 'react';
import { CreateWallet } from './CreateWallet';
import { shallow } from 'enzyme';

it('should find the button', () => {
  const wrapper = shallow(<CreateWallet />);

  expect(wrapper.find('button')).toBeTruthy();
});
