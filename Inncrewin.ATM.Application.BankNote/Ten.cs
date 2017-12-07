using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inncrewin.ATM.Application.BankNote
{
   

    public class Ten : IBankNote
    {
        public int Amount
        {
            get { return 10; }
        }
    }

  
}
