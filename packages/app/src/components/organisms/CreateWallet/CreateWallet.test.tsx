import React from 'react';
import { CreateWallet } from './CreateWallet';
import { shallow } from 'enzyme';

it('Create', () => {
  const wrapper = shallow(<CreateWallet />);

  expect(wrapper.find('button')).toBeTruthy();
});
