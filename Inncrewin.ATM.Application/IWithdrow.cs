using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Inncrewin.ATM.Application
{
    public interface IWithdrow
    {
        IEnumerable<KeyValuePair<BankNote.IBankNote, int>> Distribute(int amount);
    }
}
