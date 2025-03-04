import angular from 'angular';

export default angular.module('app.warehouse', []).config(config).name;

/** @ngInject */
config.$inject = ['msNavigationServiceProvider'];
function config(msNavigationServiceProvider) {
  // Navigation
  msNavigationServiceProvider.saveItem('warehouse.launch', {
    title: 'Launch App',
    // state: '',
    icon: 'mdi-launch',
    href: '/app/warehouse/',
    target: '_blank',
    weight: 4,
    claims: 'pro.machine.warehouse',
  });
}
