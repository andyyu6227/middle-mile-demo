/* ============================================================================
   Module registry — maps a suite menu key to the module page that renders in it.
   ============================================================================
   * Each module is ONE self-contained HTML file under modules/.
   * Add / change a line here to point the menu at your page:
        'menu-key': 'modules/your-file.html'
   * Menu keys come from MODULES in index.html:
        lh-planner · network-opt · simulation
   * Modules without an entry fall back to the built-in placeholder page.
   * Keep this file tiny — it is the only shared file you have to touch.
   ========================================================================== */
window.MODULE_PAGES = {
  'lh-planner':  'modules/lh-planner.html',
  'network-opt': 'modules/network-opt.html',
  'simulation':  'modules/simulation.html'
};
