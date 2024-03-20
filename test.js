

  QUnit.module('Count Neighbors', function() {
    QUnit.test('count', function(assert) {
      let grid = [[0, 0, 0], [0, 1, 0], [0, 0, 0]];
      
      assert.equal(countNeighbors(grid, 1, 1), 0);

     

      let grid2 = [[1, 1, 1], [1, 1, 1], [1, 1, 1]];

      assert.equal(countNeighbors(grid2, 1, 1), 8);
      assert.equal(countNeighbors(grid2, 0, 0), 3);
      assert.equal(countNeighbors(grid2, 2, 1), 5);
      assert.notEqual(countNeighbors(grid2, 1, 2), 7);
      assert.equal(countNeighbors(grid2, 1, 2), 5);

    });
    
  });

  