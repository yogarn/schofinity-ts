module.exports = {
  name: 'schofinity',
  script: 'index.ts',
  interpreter: 'bun',
  watch: true,
  restart_delay: 1000,
  env: {
    PATH: `${process.env.HOME}/.bun/bin:${process.env.PATH}`,
  },
};
