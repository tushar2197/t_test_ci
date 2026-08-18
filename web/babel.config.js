module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: { browsers: ['last 2 versions'] },
        // Next.js detects font loaders before compilation. Keep their bindings
        // lexical so `next/font` can recognize the required `const` form.
        exclude: ['@babel/plugin-transform-block-scoping'],
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
}
