export type MockType<T> = {
  [P in keyof T]?: jest.Mock<NonNullable<unknown>>;
};

export type MockOptions<T = any> = {
  [P in keyof T]?: jest.Mock<NonNullable<unknown>>;
};
