import React from 'react';
import { ImportWalletForm } from './ImportWalletForm';
import { shallow } from 'enzyme';

it('should find the title', () => {
  const wrapper = shallow(<ImportWalletForm onSubmittableChanged={jest.fn} />);

  expect(wrapper.text()).toEqual('Fill the form to import your wallet');
});
