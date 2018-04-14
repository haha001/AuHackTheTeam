using System;
using System.Collections.Generic;
using System.Linq;

namespace HackerChallenge
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
        }

	    static int balancedSum(int[] sales)
	    {
		    List<int> salesList = sales.ToList();

		    int totalSum = salesList.Sum();
		    int tempSum = 0;
		    int tempSum2 = 0;
		    for (int i = 0; i < salesList.Count; ++i)
		    {
			    tempSum += salesList[i];
			    tempSum2 = tempSum;

			    if (totalSum - tempSum2 == tempSum)
			    {
				    return i;
			    }
		    }

		    return 0;

	    }

	}
}
