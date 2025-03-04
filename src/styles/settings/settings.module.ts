import angular from 'angular';

export default angular.module('app.settings', []).config(config).name;

/** @ngInject */
config.$inject = ['$stateProvider', 'msNavigationServiceProvider'];
function config($stateProvider, msNavigationServiceProvider) {
  // Navigation
  msNavigationServiceProvider.saveItem('settings', {
    title: 'settings',
    icon: 'mdi-cog',
    weight: 9,
  });

  msNavigationServiceProvider.saveItem('settings.machineapplaunch', {
    title: 'Launch Machine App',
    icon: 'mdi-launch',
    href: '/app/machine/',
    target: '_blank',
    weight: 8,
    // claims: 'pro.machine-app',
  });
}
